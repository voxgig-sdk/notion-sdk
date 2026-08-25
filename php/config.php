<?php
declare(strict_types=1);

// Notion SDK configuration

class NotionConfig
{
    /** @var array<string,mixed>|null */
    private static ?array $shared_config = null;

    /**
     * Return the process-wide config, built once on first use. The SDK reads
     * the config on every request and never writes to it, so one instance is
     * shared by every client rather than rebuilt per client.
     *
     * PHP arrays are copy-on-write, so callers that do mutate the result get
     * their own copy and cannot disturb the shared one.
     */
    public static function shared_config(): array
    {
        if (self::$shared_config === null) {
            self::$shared_config = self::make_config();
        }
        return self::$shared_config;
    }

    /**
     * Build a fresh, fully materialised config array. Every call rebuilds the
     * whole structure, so prefer shared_config unless you need a private copy.
     */
    public static function make_config(): array
    {
        return [
            "main" => [
                "name" => "Notion",
                "slug" => "notion",
                "version" => "0.0.1",
                "target" => "php",
            ],
            "feature" => [
                "test" => [
          'options' => [
            'active' => false,
          ],
          'transport' => 'base',
        ],
            ],
            "options" => [
                "base" => "https://api.notion.com/v1",
                "auth" => [
                    "prefix" => "Bearer",
                ],
                "headers" => [
          'content-type' => 'application/json',
        ],
                "entity" => [
                    "database" => [],
                    "page" => [],
                ],
            ],
            "entity" => [
        'database' => [
          'fields' => [
            [
              'name' => 'created_time',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'id',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'last_edited_time',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'object',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'parent',
              'op' => [
                'create' => [
                  'req' => true,
                  'type' => '`$OBJECT`',
                ],
              ],
              'type' => '`$OBJECT`',
            ],
            [
              'name' => 'properties',
              'op' => [
                'create' => [
                  'req' => true,
                  'type' => '`$OBJECT`',
                ],
              ],
              'type' => '`$OBJECT`',
            ],
            [
              'name' => 'title',
              'op' => [
                'create' => [
                  'req' => true,
                  'type' => '`$ARRAY`',
                ],
              ],
              'type' => '`$ARRAY`',
            ],
          ],
          'name' => 'database',
          'op' => [
            'create' => [
              'input' => 'data',
              'name' => 'create',
              'points' => [
                [
                  'args' => [],
                  'kind' => 'http',
                  'method' => 'POST',
                  'orig' => '/databases',
                  'parts' => [
                    'databases',
                  ],
                  'select' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'args' => [
                    'params' => [
                      [
                        'kind' => 'param',
                        'name' => 'id',
                        'orig' => 'id',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                    ],
                  ],
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/databases/{id}',
                  'parts' => [
                    'databases',
                    '{id}',
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
            'update' => [
              'input' => 'data',
              'name' => 'update',
              'points' => [
                [
                  'args' => [
                    'params' => [
                      [
                        'kind' => 'param',
                        'name' => 'id',
                        'orig' => 'id',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                    ],
                  ],
                  'kind' => 'http',
                  'method' => 'PATCH',
                  'orig' => '/databases/{id}',
                  'parts' => [
                    'databases',
                    '{id}',
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
        'page' => [
          'fields' => [
            [
              'name' => 'archived',
              'type' => '`$BOOLEAN`',
            ],
            [
              'name' => 'created_time',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'id',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'last_edited_time',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'object',
              'type' => '`$STRING`',
            ],
            [
              'name' => 'parent',
              'op' => [
                'create' => [
                  'req' => true,
                  'type' => '`$OBJECT`',
                ],
              ],
              'type' => '`$OBJECT`',
            ],
            [
              'name' => 'properties',
              'op' => [
                'create' => [
                  'req' => true,
                  'type' => '`$OBJECT`',
                ],
              ],
              'type' => '`$OBJECT`',
            ],
          ],
          'name' => 'page',
          'op' => [
            'create' => [
              'input' => 'data',
              'name' => 'create',
              'points' => [
                [
                  'args' => [],
                  'kind' => 'http',
                  'method' => 'POST',
                  'orig' => '/pages',
                  'parts' => [
                    'pages',
                  ],
                  'select' => [],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
            'load' => [
              'input' => 'data',
              'name' => 'load',
              'points' => [
                [
                  'args' => [
                    'params' => [
                      [
                        'kind' => 'param',
                        'name' => 'id',
                        'orig' => 'id',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                    ],
                  ],
                  'kind' => 'http',
                  'method' => 'GET',
                  'orig' => '/pages/{id}',
                  'parts' => [
                    'pages',
                    '{id}',
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
            'update' => [
              'input' => 'data',
              'name' => 'update',
              'points' => [
                [
                  'args' => [
                    'params' => [
                      [
                        'kind' => 'param',
                        'name' => 'id',
                        'orig' => 'id',
                        'reqd' => true,
                        'type' => '`$STRING`',
                      ],
                    ],
                  ],
                  'kind' => 'http',
                  'method' => 'PATCH',
                  'orig' => '/pages/{id}',
                  'parts' => [
                    'pages',
                    '{id}',
                  ],
                  'select' => [
                    'exist' => [
                      'id',
                    ],
                  ],
                  'transform' => [
                    'req' => '`reqdata`',
                    'res' => '`body`',
                  ],
                ],
              ],
            ],
          ],
          'relations' => [
            'ancestors' => [],
          ],
        ],
      ],
        ];
    }


    public static function make_feature(string $name)
    {
        require_once __DIR__ . '/features.php';
        return NotionFeatures::make_feature($name);
    }
}
