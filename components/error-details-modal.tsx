'use client'

import { X } from 'lucide-react'
import { Button } from './ui/button'

interface ErrorDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    error: string
    monitorName: string
    monitorUrl: string
    timestamp?: Date | string
}

export function ErrorDetailsModal({ isOpen, onClose, error, monitorName, monitorUrl, timestamp }: ErrorDetailsModalProps) {
    if (!isOpen) return null

    const troubleshooting = getTroubleshootingSteps(error)
    const lastChecked = timestamp ? new Date(timestamp) : null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-card border rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold">Error Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">{monitorName}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Error Summary */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Error</h3>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-500 font-medium">{error}</p>
                        </div>
                    </div>

                    {/* Monitor Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Monitor URL</h3>
                        <a href={monitorUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline break-all">
                            {monitorUrl}
                        </a>
                    </div>

                    {lastChecked && !Number.isNaN(lastChecked.getTime()) && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Last Checked</h3>
                            <p className="text-foreground">{lastChecked.toLocaleString()}</p>
                        </div>
                    )}

                    {/* Explanation */}
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">What This Means</h3>
                        <p className="text-foreground leading-relaxed">{troubleshooting.explanation}</p>
                    </div>

                    {/* Troubleshooting Steps */}
                    {troubleshooting.steps.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Troubleshooting Steps</h3>
                            <ol className="list-decimal list-inside space-y-2">
                                {troubleshooting.steps.map((step, i) => (
                                    <li key={i} className="text-foreground leading-relaxed">{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}

                    {/* Possible Causes */}
                    {troubleshooting.causes.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Possible Causes</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {troubleshooting.causes.map((cause, i) => (
                                    <li key={i} className="text-muted-foreground">{cause}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    )
}

function getTroubleshootingSteps(error: string): { explanation: string; steps: string[]; causes: string[] } {
    const errorLower = error.toLowerCase()

    if (errorLower.includes('404') || errorLower.includes('not found')) {
        return {
            explanation: 'The server responded with a 404 status code, meaning the requested page or resource does not exist on the server.',
            steps: [
                'Verify the URL is correct and the page exists',
                'Check if the page has been moved or deleted',
                'Review your website\'s routing configuration',
                'Check server logs for more details'
            ],
            causes: [
                'The page was deleted or moved',
                'Incorrect URL configuration in the monitor',
                'Server misconfiguration',
                'The website structure changed'
            ]
        }
    }

    if (errorLower.includes('500') || errorLower.includes('internal server error')) {
        return {
            explanation: 'The server encountered an internal error and could not complete the request. This typically indicates a problem with the server-side code or configuration.',
            steps: [
                'Check server logs for detailed error messages',
                'Review recent code deployments',
                'Verify database connectivity',
                'Check server resource usage (CPU, memory, disk)',
                'Contact your hosting provider if the issue persists'
            ],
            causes: [
                'Server-side code error (syntax, runtime, or logic)',
                'Database connection failure',
                'Insufficient server resources',
                'Misconfigured server settings'
            ]
        }
    }

    if (errorLower.includes('502') || errorLower.includes('bad gateway')) {
        return {
            explanation: 'The server received an invalid response from an upstream server. This usually happens when a reverse proxy or load balancer cannot reach the application server.',
            steps: [
                'Check if the application server is running',
                'Verify reverse proxy/load balancer configuration',
                'Check network connectivity between servers',
                'Review server logs for connection errors',
                'Restart the application server if needed'
            ],
            causes: [
                'Application server is down or not responding',
                'Network issues between proxy and application',
                'Timeout waiting for application response',
                'Misconfigured proxy settings'
            ]
        }
    }

    if (errorLower.includes('503') || errorLower.includes('service unavailable')) {
        return {
            explanation: 'The server is temporarily unable to handle the request. This often occurs during maintenance or when the server is overloaded.',
            steps: [
                'Wait a few minutes and try again',
                'Check if scheduled maintenance is in progress',
                'Verify server resource availability',
                'Check if rate limiting is applied',
                'Contact your hosting provider for status updates'
            ],
            causes: [
                'Server is under maintenance',
                'Server is overloaded with requests',
                'Application is starting up or restarting',
                'Rate limiting or DDoS protection activated'
            ]
        }
    }

    if (errorLower.includes('dns') || errorLower.includes('domain not found')) {
        return {
            explanation: 'The domain name could not be resolved to an IP address. This means the DNS servers cannot find the website.',
            steps: [
                'Verify the domain name is spelled correctly',
                'Check if the domain registration is active and not expired',
                'Verify DNS records are configured correctly',
                'Wait for DNS propagation (up to 48 hours for new domains)',
                'Try using a different DNS server to test'
            ],
            causes: [
                'Domain name doesn\'t exist or is misspelled',
                'Domain registration expired',
                'DNS records not configured',
                'DNS propagation still in progress'
            ]
        }
    }

    if (errorLower.includes('timeout')) {
        return {
            explanation: 'The server did not respond within the expected time frame (15 seconds). This indicates the server is slow or unreachable.',
            steps: [
                'Check if the server is experiencing high load',
                'Verify network connectivity to the server',
                'Review server performance metrics',
                'Check for slow database queries',
                'Consider increasing server resources if consistently slow'
            ],
            causes: [
                'Server is overloaded or under heavy traffic',
                'Slow network connection',
                'Database performance issues',
                'Inefficient server-side code',
                'Firewall blocking the request'
            ]
        }
    }

    if (errorLower.includes('connection refused')) {
        return {
            explanation: 'The server actively refused the connection. This typically means no service is listening on the specified port.',
            steps: [
                'Verify the web server is running',
                'Check if the correct port is being used',
                'Review firewall rules and security groups',
                'Confirm the application is bound to the correct address',
                'Check server logs for startup errors'
            ],
            causes: [
                'Web server is not running',
                'Service is listening on a different port',
                'Firewall is blocking the connection',
                'Application failed to start properly'
            ]
        }
    }

    if (errorLower.includes('ssl') || errorLower.includes('tls') || errorLower.includes('certificate')) {
        return {
            explanation: 'There is a problem with the SSL/TLS certificate. This prevents a secure connection from being established.',
            steps: [
                'Check if the SSL certificate is valid and not expired',
                'Verify the certificate matches the domain name',
                'Ensure the certificate chain is complete',
                'Check if the certificate is trusted by browsers',
                'Renew or replace the certificate if needed'
            ],
            causes: [
                'SSL certificate expired',
                'Certificate doesn\'t match the domain',
                'Self-signed or untrusted certificate',
                'Incomplete certificate chain',
                'Outdated TLS protocol version'
            ]
        }
    }

    if (errorLower.includes('403') || errorLower.includes('forbidden')) {
        return {
            explanation: 'The server understood the request but refuses to authorize it. You don\'t have permission to access this resource.',
            steps: [
                'Verify access permissions are configured correctly',
                'Check if IP blocking or rate limiting is active',
                'Review authentication requirements',
                'Check .htaccess or server configuration files',
                'Ensure the user agent is not blocked'
            ],
            causes: [
                'Insufficient permissions configured',
                'IP address is blocked',
                'Authentication required but not provided',
                'Rate limiting or security rules triggered'
            ]
        }
    }

    if (errorLower.includes('401') || errorLower.includes('unauthorized')) {
        return {
            explanation: 'Authentication is required but was not provided or failed. The server requires valid credentials.',
            steps: [
                'Verify authentication credentials are correct',
                'Check if authentication headers are being sent',
                'Review API key or token configuration',
                'Ensure the authentication method matches server requirements'
            ],
            causes: [
                'Missing authentication credentials',
                'Invalid username or password',
                'Expired authentication token',
                'Incorrect authentication method'
            ]
        }
    }

    if (errorLower.includes('keyword') && errorLower.includes('missing')) {
        return {
            explanation: 'The page loaded successfully but did not contain the expected keyword. This might indicate the page content has changed or an error page is being served.',
            steps: [
                'Visit the URL in a browser to verify the content',
                'Check if the keyword spelling is correct',
                'Verify the page hasn\'t changed its content',
                'Ensure the page isn\'t showing an error message instead',
                'Update the keyword if the content legitimately changed'
            ],
            causes: [
                'Page content was updated and no longer contains the keyword',
                'Server is returning an error page instead of the expected content',
                'Keyword is misspelled in the monitor configuration',
                'Page requires authentication or cookies'
            ]
        }
    }

    // Generic network error
    return {
        explanation: 'A network error occurred while trying to reach the server. This could be due to various connectivity issues.',
        steps: [
            'Check if the server is online and accessible',
            'Verify your network connection is working',
            'Try accessing the URL in a browser',
            'Check for any reported service outages',
            'Review server and network logs for details'
        ],
        causes: [
            'Server is offline or unreachable',
            'Network connectivity issues',
            'Firewall or security rules blocking access',
            'DNS or routing problems'
        ]
    }
}
